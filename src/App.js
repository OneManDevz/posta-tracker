import React, { useState, useEffect } from 'react'
import './App.css'
import PackageResults from './components/packageResults'
import ParcelsToFind from './components/parcelsToFind'
import { Button, Form, Table, Input, Alert } from 'reactstrap'

const App = () => {
  const [parcelsToFind, setParcelsToFind] = useState([])
  const [parcelsData, setParcelsData] = useState([])
  const [input, setInput] = useState('')
  const [errorLength, setErrorLength] = useState('')

  const inputOnChange = (e) => {
    setInput(e.target.value)
  }

  const addPackageNumber = (e) => {
    e.preventDefault()

    if (input !== '') {
      let parseInput = input
      parseInput = parseInput.split(',')
      parseInput.forEach((elem) => {
        let newObj = {
          parcel: elem,
          response: '',
        }
        setParcelsToFind((prevParcelsToFind) => [...prevParcelsToFind, newObj])
      })

      setInput('')
      setErrorLength('')
    } else {
      setErrorLength('Nezadali ste číslo zásielky')
    }
  }

  const getPostaResponse = () => {
    let urlString = 'https://api.posta.sk/private/search?q='
    parcelsToFind.forEach((element) => {
      urlString += element.parcel + ','
    })
    urlString += '&m=tnt'
    fetch(urlString)
      .then((data) => data.json())
      .then((response) => {
        setParcelsData(response.parcels)

        localStorage.setItem('parcels', JSON.stringify(parcelsToFind))
      })
  }

  const deleteParcelsToFind = () => {
    setParcelsToFind([])
    setParcelsData([])
    localStorage.removeItem('parcels')
  }

  // const removeOne = (index) => {
  //   setParcelsToFind((prevParcelsToFind) => [...prevParcelsToFind, parcelsToFind.splice(index, 1)])
  // }

  useEffect(() => {
    let storageString = localStorage.getItem('parcels')

    storageString = storageString === null ? [] : JSON.parse(storageString)
    let parcelsArray = []

    storageString.forEach((elem) => {
      parcelsArray.push(elem)
    })

    setParcelsToFind(parcelsArray)
  }, [])

  return (
    <div className="App">
      <h2>Pošta Tracker</h2>
      <Form onSubmit={addPackageNumber}>
        {errorLength && <Alert color="danger">{errorLength}</Alert>}
        <Input
          type="textarea"
          placeholder="Čísla zásielok oddelené čiarkou"
          id="input"
          value={input}
          onChange={inputOnChange}
        />
        <br />
        <Button color="success" size="sm">
          Pridať
        </Button>
      </Form>
      <hr />
      {parcelsToFind.length >= 1 && (
        <div>
          <Table size="sm" style={{ textAlign: 'center', maxWidth: '50%' }}>
            <ParcelsToFind parcelsToFind={parcelsToFind} />
            {/* <ParcelsToFind parcelsToFind={parcelsToFind}  /> removeOne={removeOne} */}
          </Table>
          <PackageResults
            parcelsData={parcelsData}
            deleteParcelsToFind={deleteParcelsToFind}
            getPostaResponse={getPostaResponse}
          />
        </div>
      )}
    </div>
  )
}

export default App
