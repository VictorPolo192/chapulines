
"use client"

import { useState } from "react"
import { Blobatar } from "@blobatar/react"
import "blobatar/motion.css"
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import vehicles from "@/public/vehiculos_200.json"

export default function Page() {
  const itemsPerPage = 25
  const [currentPage, setCurrentPage] = useState(1)
  const [powerOrder, setPowerOrder] = useState<"asc" | "desc" | null>(null)
  const [search, setSearch] = useState("")
  const vehiclesByPower = [...vehicles].sort((a, b) => a.potencia_cv - b.potencia_cv)
  const averagePower = vehicles.reduce((total, vehicle) => total + vehicle.potencia_cv, 0) / vehicles.length
  const averageVehicle = vehiclesByPower.reduce((closest, vehicle) =>
    Math.abs(vehicle.potencia_cv - averagePower) < Math.abs(closest.potencia_cv - averagePower) ? vehicle : closest,
  )
  const featuredVehicles = [
    { title: "Potencia media", vehicle: averageVehicle, accent: "border-yellow-400" },
    { title: "Coche cutre", vehicle: vehiclesByPower[0], accent: "border-red-400" },
    { title: "Coche potente", vehicle: vehiclesByPower[vehiclesByPower.length - 1], accent: "border-green-400" },
  ]
  const normalizedSearch = search.trim().toLowerCase()
  const filteredVehicles = vehicles.filter((vehicle) =>
    [vehicle.id, vehicle.marca, vehicle.modelo, vehicle.potencia_cv, vehicle.pais_fabricacion]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  )
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (powerOrder === "asc") return a.potencia_cv - b.potencia_cv
    if (powerOrder === "desc") return b.potencia_cv - a.potencia_cv
    return 0
  })
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentVehicles = sortedVehicles.slice(startIndex, startIndex + itemsPerPage)

  const changePowerOrder = (order: "asc" | "desc") => {
    setPowerOrder(order)
    setCurrentPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black">
      <div className="w-[1368px]">
        <div className="grid grid-cols-12">
          <div className="col-start-2 col-end-12 text-lg text-white">
            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="min-w-0 flex-1">
            <Blobatar name="alain00" animate="hover" />
            <label className="mb-4 flex w-fit items-center gap-2 rounded-md border border-white/30 bg-white px-3 py-2 text-black">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Buscar vehículos..."
                aria-label="Buscar vehículos"
                className="w-56 bg-transparent outline-none placeholder:text-black/50"
              />
            </label>
            <Table className="min-w-[700px] table-fixed">
              <TableCaption className="mt-4 text-base text-white/70">
                Lista de vehículos.
              </TableCaption>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-transparent">
                  <TableHead className="w-[10%] text-base text-white">ID</TableHead>
                  <TableHead className="w-[20%] text-base text-white">Marca</TableHead>
                  <TableHead className="w-[25%] text-base text-white">Modelo</TableHead>
                  <TableHead className="w-[22%] text-right text-base text-white">
                    <div className="flex items-center justify-end gap-1">
                      Potencia
                      <button
                        type="button"
                        onClick={() => changePowerOrder("desc")}
                        aria-label="Ordenar potencia de mayor a menor"
                        aria-pressed={powerOrder === "desc"}
                        className={`rounded p-1 ${powerOrder === "desc" ? "bg-green-500 text-black" : "hover:bg-white/10"}`}
                      >
                        <ArrowDownWideNarrow size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => changePowerOrder("asc")}
                        aria-label="Ordenar potencia de menor a mayor"
                        aria-pressed={powerOrder === "asc"}
                        className={`rounded p-1 ${powerOrder === "asc" ? "bg-green-500 text-black" : "hover:bg-white/10"}`}
                      >
                        <ArrowUpNarrowWide size={18} />
                      </button>
                    </div>
                  </TableHead>
                  <TableHead className="w-[23%] text-base text-white">País de fabricación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id} className="border-white/20 hover:bg-white/10">
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{vehicle.marca}</TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell className="text-right">{vehicle.potencia_cv} CV</TableCell>
                    <TableCell>{vehicle.pais_fabricacion}</TableCell>
                  </TableRow>
                ))}
                {currentVehicles.length === 0 && (
                  <TableRow className="border-white/20 hover:bg-transparent">
                    <TableCell colSpan={5} className="py-8 text-center text-white/70">
                      No se han encontrado vehículos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="border-white/20 bg-white/10 hover:bg-white/10">
                  <TableCell colSpan={4}>Total de vehículos</TableCell>
                  <TableCell className="text-right">{filteredVehicles.length}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="mt-6 flex items-center justify-between gap-4 text-base">
              <span className="text-white/70">
                Mostrando {filteredVehicles.length === 0 ? 0 : startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredVehicles.length)} de {filteredVehicles.length}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page - 1)}
                  disabled={currentPage === 1}
                  className="rounded-md border border-white/30 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1" aria-label="Paginación">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Ir a la página ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`h-9 w-9 rounded-md border ${
                        currentPage === page ? "border-green-300 bg-green-500 text-black" : "border-white/30"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => page + 1)}
                  disabled={currentPage === totalPages || filteredVehicles.length === 0}
                  className="rounded-md border border-white/30 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
              </div>
              </div>
              <section className="grid w-full grid-cols-1 gap-4 xl:w-72" aria-label="Vehículos destacados">
                {featuredVehicles.map(({ title, vehicle, accent }) => (
                  <article key={title} className={`rounded-lg border-t-4 ${accent} bg-white/10 p-4`}>
                    <div>
                      <div>
                        <h2 className="font-semibold">{title}</h2>
                        <p className="mt-1 text-base text-white/70">
                          {vehicle.marca} {vehicle.modelo}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-2xl font-bold">{vehicle.potencia_cv} CV</p>
                  </article>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
