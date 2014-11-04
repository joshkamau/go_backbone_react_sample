package main

var insertSql = `
INSERT INTO contacts(firstname, lastname, mobile, email)
VALUES($1, $2, $3, $4) RETURNING id
`
var updateSql = `
UPDATE contacts SET 
	firstname = $1,
	lastname = $2, 
	mobile = $3,
	email = $4
WHERE id = $5
`

var deleteSql = `
DELETE FROM contacts WHERE id = $1
`

var loadSql = `
SELECT id, firstname, lastname, mobile, email FROM contacts;
`

var loadByID = `
SELECT id, firstname, lastname, mobile, email FROM contacts WHERE id = $1
`

func saveAddress(address *Address) (int64, error) {
	var id int64
	err := db.QueryRow(insertSql, address.Firstname, address.Lastname, address.Mobile, address.Email).Scan(&id)
	if err != nil {
		return id, err
	}
	return id, nil
}

func updateAddress(address *Address) error {
	_, err := db.Exec(updateSql, address.Firstname, address.Lastname, address.Mobile, address.Email, address.Id)
	if err != nil {
		return err
	}
	return nil
}

func deleteAddress(id int64) error {
	_, err := db.Exec(deleteSql, id)
	return err
}

func loadAddresses() ([]Address, error) {
	var (
		id        int64
		firstname string
		lastname  string
		mobile    string
		email     string
	)
	rows, err := db.Query(loadSql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var addresses []Address
	for rows.Next() {
		rows.Scan(&id, &firstname, &lastname, &mobile, &email)
		address := Address{
			Id:        id,
			Firstname: firstname,
			Lastname:  lastname,
			Mobile:    mobile,
			Email:     email,
		}
		addresses = append(addresses, address)
	}

	return addresses, nil
}

func loadAddressByID(addressId int64) (*Address, error) {
	var (
		id        int64
		firstname string
		lastname  string
		mobile    string
		email     string
	)
	err := db.QueryRow(loadByID, addressId).Scan(&id, &firstname, &lastname, &mobile, &email)
	if err != nil {
		return nil, err
	}
	address := Address{
		Id:        id,
		Firstname: firstname,
		Lastname:  lastname,
		Mobile:    mobile,
		Email:     email,
	}
	return &address, nil
}
