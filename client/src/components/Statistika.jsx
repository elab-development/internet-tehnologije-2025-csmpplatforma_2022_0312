import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { API_URL } from '../config';

const Statistika = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/student/statistika`);
        if (res.data && Array.isArray(res.data)) {
          const formatted = [["Student", "Prosečna Ocena"]];
          res.data.forEach((item) => {
            const ocena = parseFloat(item.prosecnaOcena || item.ocena) || 0;
            formatted.push([`${item.ime} ${item.prezime}`, ocena]);
          });
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const options = {
    title: "Prosečne ocene po studentima",
    hAxis: { title: "Studenti" },
    vAxis: { title: "Ocena", minValue: 5, maxValue: 10 },
    legend: "none",
    colors: ["#4681d8"],
  };

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f4f7f6"
    }}>
      
      <div style={{ 
        backgroundColor: "white", 
        padding: "30px", 
        borderRadius: "15px", 
        width: "90%",           
        maxWidth: "800px", 
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          📊 Vizuelizacija uspeha studenata
        </h2>
        
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {loading ? (
            <p>Učitavanje...</p>
          ) : chartData.length > 1 ? (
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="400px"
              data={chartData}
              options={options}
              loader={<div>Učitavanje...</div>}
            />
          ) : (
            <p>Nema podataka.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistika;