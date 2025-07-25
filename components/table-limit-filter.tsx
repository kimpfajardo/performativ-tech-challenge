import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const TableLimitFilter = ({
  limit,
  onChange,
}: {
  onChange: (value: string) => void;
  limit: string;
}) => {
  return (
    <div className="flex justify-end mb-4 lg:mb-10">
      <div className="flex items-center gap-6 font-bold text-xs md:text-sm">
        <span>Showing</span>
        <Select value={limit} onValueChange={onChange}>
          <SelectTrigger className="w-[80px] border-2 border-primary">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>
    </div>
  );
};
