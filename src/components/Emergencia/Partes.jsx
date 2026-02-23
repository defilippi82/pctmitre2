import { useState } from "react";

const franjasHorarias = [
  "00:00 - 06:00",
  "06:00 - 08:30",
  "08:30 - 12:00",
  "12:00 - 16:00",
  "16:00 - 18:30"
];

const sectoresBase = [
  { nombre: "AP", programados: 0 },
  { nombre: "BP", programados: 0 },
  { nombre: "CP", programados: 0 },
  { nombre: "DP", programados: 0 },
  { nombre: "EP", programados: 0 },
  { nombre: "Tren de la Costa", programados: 0 }
];

export default function Partes() {
  const [data, setData] = useState(
    franjasHorarias.map((franja) => ({
      franja,
      sectores: sectoresBase.map((s) => ({
        ...s,
        circulacion: 0,
        demorados: 0,
        cancelados: 0
      }))
    }))
  );

  const handleChange = (franjaIndex, sectorIndex, field, value) => {
    const updated = [...data];
    updated[franjaIndex].sectores[sectorIndex][field] = Number(value);
    setData(updated);
  };

  const calcularRegularidad = (programados, cancelados) => {
    if (programados === 0) return 0;
    return (((programados - cancelados) / programados) * 100).toFixed(2);
  };

  return (
    <div>
      <h2>TF04 - Puesto Control Trenes</h2>

      {data.map((franjaData, franjaIndex) => {
        let totalProgramados = 0;
        let totalCancelados = 0;

        return (
          <div key={franjaIndex} style={{ marginBottom: "40px" }}>
            <h3>Franja: {franjaData.franja}</h3>

            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Programados</th>
                  <th>En circulación</th>
                  <th>Demorados</th>
                  <th>Cancelados</th>
                  <th>Regularidad %</th>
                </tr>
              </thead>
              <tbody>
                {franjaData.sectores.map((sector, sectorIndex) => {
                  totalProgramados += sector.programados;
                  totalCancelados += sector.cancelados;

                  return (
                    <tr key={sectorIndex}>
                      <td>{sector.nombre}</td>

                      <td>
                        <input
                          type="number"
                          value={sector.programados}
                          onChange={(e) =>
                            handleChange(
                              franjaIndex,
                              sectorIndex,
                              "programados",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={sector.circulacion}
                          onChange={(e) =>
                            handleChange(
                              franjaIndex,
                              sectorIndex,
                              "circulacion",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={sector.demorados}
                          onChange={(e) =>
                            handleChange(
                              franjaIndex,
                              sectorIndex,
                              "demorados",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="number"
                          value={sector.cancelados}
                          onChange={(e) =>
                            handleChange(
                              franjaIndex,
                              sectorIndex,
                              "cancelados",
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        {calcularRegularidad(
                          sector.programados,
                          sector.cancelados
                        )} %
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h4>
              Total Regularidad Franja:{" "}
              {calcularRegularidad(totalProgramados, totalCancelados)} %
            </h4>
          </div>
        );
      })}
    </div>
  );
}