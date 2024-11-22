import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CashRegisterShift } from "./CashRegisterTypes";
import { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "@/components/Context/ContextSucursal";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale("es");
const formatearFecha = (fecha: string) => {
  return dayjs(fecha).format("DD MMMM YYYY hh:mm A");
};

export default function CashRegisters() {
  const sucursalId = useStore((state) => state.sucursalId);
  const [shift, setShift] = useState<CashRegisterShift[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
    }).format(amount);
  };

  useEffect(() => {
    const getCashRegists = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/caja/get-all-cash-register-sucursal/${sucursalId}`
        );

        if (response.status === 200) {
          setShift(response.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error al conseguir registros");
      }
    };
    getCashRegists();
  }, [sucursalId]);

  //=============PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalPages = Math.ceil(shift.length / itemsPerPage);

  // Calcular el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcular el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtener los elementos de la página actual
  const currentItems = shift.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {currentItems &&
        currentItems.map((shift) => (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Turno de Caja #{shift.id}
                  <Badge
                    className="ml-2"
                    variant={
                      shift.estado === "CERRADO" ? "destructive" : "default"
                    }
                  >
                    {shift.estado}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Sucursal:</strong> {shift.sucursal.nombre}
                    </p>
                    <p>
                      <strong>Usuario:</strong> {shift.usuario.nombre}
                    </p>
                    <p>
                      <strong>Fecha de inicio:</strong>{" "}
                      {formatearFecha(shift.fechaInicio)}
                    </p>
                    <p>
                      <strong>Fecha de cierre:</strong>{" "}
                      {formatearFecha(shift.fechaCierre)}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Saldo inicial:</strong>{" "}
                      {formatCurrency(shift.saldoInicial)}
                    </p>
                    <p>
                      <strong>Saldo final:</strong>{" "}
                      {formatCurrency(shift.saldoFinal)}
                    </p>
                    <p>
                      <strong>Diferencia:</strong>{" "}
                      {formatCurrency(shift.saldoFinal - shift.saldoInicial)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="depositos">
                <AccordionTrigger>Depósitos</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Banco</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Descripción</TableHead>

                        <TableHead>Usado para cierre</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shift &&
                        shift.depositos.map((deposito) => (
                          <TableRow key={deposito.id}>
                            <TableCell>{deposito.banco}</TableCell>
                            <TableCell>
                              {formatCurrency(deposito.monto)}
                            </TableCell>
                            <TableCell>
                              {formatearFecha(deposito.fechaDeposito)}
                            </TableCell>
                            <TableCell>
                              {deposito?.usuario?.nombre
                                ? deposito?.usuario?.nombre
                                : "No disponible"}
                            </TableCell>

                            <TableCell>{deposito.descripcion}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  deposito.usadoParaCierre
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {deposito.usadoParaCierre ? "Sí" : "No"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="egresos">
                <AccordionTrigger>Egresos</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shift.egresos.map((egreso) => (
                        <TableRow key={egreso.id}>
                          <TableCell>{egreso.descripcion}</TableCell>
                          <TableCell>{formatCurrency(egreso.monto)}</TableCell>
                          <TableCell>
                            {formatearFecha(egreso.fechaEgreso)}
                          </TableCell>
                          <TableCell>{egreso.usuario.nombre}</TableCell>
                          <TableCell>{egreso.descripcion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ventas">
                <AccordionTrigger>Ventas</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Venta</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Código Producto</TableHead>
                        <TableHead>Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shift.ventas.map((venta) =>
                        venta.productos.map((producto, index) => (
                          <TableRow key={`${venta.id}-${index}`}>
                            <TableCell>{venta.id}</TableCell>
                            <TableCell>
                              {producto.producto.nombre || "N/A"}
                            </TableCell>
                            <TableCell>{producto.cantidad}</TableCell>
                            <TableCell>
                              {producto.producto.codigoProducto || "N/A"}
                            </TableCell>
                            <TableCell>
                              {formatearFecha(venta.fechaVenta)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="comentario">
                <AccordionTrigger>Comentario</AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-wrap">{shift.comentario}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        ))}
      <div className="flex items-center justify-center py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button onClick={() => onPageChange(1)}>Primero</Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </PaginationPrevious>
            </PaginationItem>

            {/* Sistema de truncado */}
            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-muted-foreground">...</span>
                </PaginationItem>
              </>
            )}

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              if (
                page === currentPage ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}

            {currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <span className="text-muted-foreground">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => onPageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationNext>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant={"destructive"}
                onClick={() => onPageChange(totalPages)}
              >
                Último
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}