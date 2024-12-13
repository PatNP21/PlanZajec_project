import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import axios from 'axios';

function App() {

  const [data, setData] = useState([])

  const changeCriteria = (data) => {
    console.log(data)
  } 

  const downloadFile = async () => {
    return await axios.get(
      "https://it.pk.edu.pl/wp-content/uploads/sites/65/2024/10/25102024_11_INFORMATYKA-zima-rozklad-NIESTACJONARNE-2024_2025.xls",
      {responseType: 'blob'}
    ).then(async (res) => {
      alert("Plan pobrany pomyślnie!")
      let blob = await res.data
      let url = URL.createObjectURL(blob)
      console.log(url)
      return url

      /*const link = document.createElement('a');
      link.href = url;
      link.download = 'pobrany_plik.xls'; // Nazwa pliku

      // Automatycznie klikamy w link, aby rozpocząć pobieranie
      document.body.appendChild(link);
      link.click();

      // Usuwamy link z dokumentu
      document.body.removeChild(link);

      // Zwolnienie pamięci
      URL.revokeObjectURL(url);*/
    }).catch((err) => {
      alert(err.message)
      console.error(err.message)
      return err.message
    })
  }


  const handleFileUpload = (event) => {
    fetch(downloadFile())
    .then(res => 
      res.blob()
    ).then(blob => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, {type: 'binary'});
        const scheduler = workbook.Sheets[workbook.SheetNames[0]];
        const data_in_json = XLSX.utils.sheet_to_json(scheduler);
        setData(data_in_json)
        console.log(data_in_json)
      }
      reader.readAsBinaryString(blob)
    }).catch((err) => {
      alert(err.message)
      console.error(err.message)
    })
  }

  return (
    <div className="App">

      <button onClick={handleFileUpload}>Pobierz plan</button>
      <form onSubmit={changeCriteria}>
        <label>Specjalizacja</label>
        <select>
          <option value="CY1">Cyberbezpieczeństwo gr1</option>
          <option value="CY2">Cyberbezpieczeństwo gr2</option>
          <option value="CY3">Cyberbezpieczeństwo gr3</option>
          <option value="DS1">Data science gr1</option>
          <option value="DS2">Data science gr2</option>
        </select>
        <input type="submit" value="Zatwierdź"/>
      </form>
    </div>
  );
}

export default App;
