import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  label: string;
  accessor: keyof T;
  className?: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
};

type GenericTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  footer?: React.ReactNode;
  getRowKey: (row: T) => string | number;
};

export function GenericTable<T>({
  data,
  columns,
  caption,
  footer,
  getRowKey,
}: GenericTableProps<T>) {
  return (
    <Table className="w-full">
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.accessor as string}
              className={col.className}
              style={{ textAlign: col.align }}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow className="hover:bg-slate-200" key={getRowKey(row)}>
            {columns.map((col) => {
              const content =
                typeof col.render === "function"
                  ? col.render(row)
                  : (row[col.accessor as keyof T] as React.ReactNode);

              return (
                <TableCell
                  key={String(col.accessor)}
                  className={col.className}
                  style={{ textAlign: col.align }}>
                  {content}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
      {footer && <TableFooter>{footer}</TableFooter>}
    </Table>
  );
}
