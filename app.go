package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"net/http"
)

type Address struct {
	Id        int64  `json:"id"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Mobile    string `json:"mobile"`
	Email     string `json:"email"`
}

var db *sql.DB

func init() {
	driverName := "postgres"
	connStr := "dbname=addressbook user=postgres password=pass sslmode=disable"
	sqlDB, err := sql.Open(driverName, connStr)
	if err != nil {
		panic(err)
	}
	db = sqlDB
}

func main() {

	defer db.Close()

	http.Handle("/", http.FileServer(http.Dir("./web")))

	http.HandleFunc("/api/address/save", AddressSaveHandler)
	http.HandleFunc("/api/address/edit", AddressEditHandler)
	http.HandleFunc("/api/address/delete", AddressDeleteHandler)
	http.HandleFunc("/api/address/loadByID", AddressLoadByIDHandler)
	http.HandleFunc("/api/address/loadAll", AddressLoadAllHandler)

	fmt.Println("Starting server on port 3000")
	http.ListenAndServe(":3000", nil)
}

func AddressSaveHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("creating new address.")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fail(w, err)
		return
	}
	var address Address
	err = json.Unmarshal(body, &address)
	if err != nil {
		fail(w, err)
		return
	}
	newAddressID, err := saveAddress(&address)

	if err != nil {
		fail(w, err)
		return
	}

	pass(w, newAddressID)
}

func AddressEditHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("editing address")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fail(w, err)
		return
	}
	var address Address
	err = json.Unmarshal(body, &address)
	if err != nil {
		fail(w, err)
		return
	}
	err = updateAddress(&address)
	if err != nil {
		fail(w, err)
		return
	}
	pass(w, nil)
}

func AddressDeleteHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fail(w, err)
		return
	}
	input := struct {
		Id int64
	}{}
	err = json.Unmarshal(body, &input)
	if err != nil {
		fail(w, err)
		return
	}
	err = deleteAddress(input.Id)
	if err != nil {
		fail(w, err)
		return
	}
	pass(w, nil)
}

func AddressLoadByIDHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fail(w, err)
		return
	}
	input := struct {
		Id int64 `json:"id"`
	}{}
	err = json.Unmarshal(body, &input)
	if err != nil {
		fail(w, err)
		return
	}
	address, err := loadAddressByID(input.Id)
	if err != nil {
		fail(w, err)
		return
	}
	pass(w, address)
}

func AddressLoadAllHandler(w http.ResponseWriter, r *http.Request) {
	addresses, err := loadAddresses()
	if err != nil {
		fail(w, err)
		return
	}
	pass(w, addresses)
}

func pass(w http.ResponseWriter, data interface{}) {
	result := struct {
		Data    interface{} `json:"data"`
		Success bool        `json:"success"`
	}{
		Data:    data,
		Success: true,
	}
	resp, err := json.Marshal(&result)
	if err != nil {
		fail(w, err)
		return
	}
	fmt.Fprintln(w, string(resp))
}

func fail(w http.ResponseWriter, failure error) {
	result := struct {
		Message string `json:"message"`
		Success bool   `json:"success"`
	}{
		Message: failure.Error(),
		Success: false,
	}

	resp, err := json.Marshal(&result)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}
	fmt.Fprintln(w, string(resp))
}
