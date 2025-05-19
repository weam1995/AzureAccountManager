import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}: PaginationProps) {
  // Calculate page info
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Determine which page buttons to show
  const getPageButtons = () => {
    const buttons = [];
    
    // Always include first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange(1)}
        className={currentPage === 1 
          ? "bg-msblue-primary text-white hover:bg-msblue-secondary" 
          : "border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50"}
      >
        1
      </Button>
    );
    
    // Add ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis1" className="px-2 text-neutral-400">...</span>
      );
    }
    
    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages (handled separately)
      
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className={currentPage === i 
            ? "bg-msblue-primary text-white hover:bg-msblue-secondary" 
            : "border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50"}
        >
          {i}
        </Button>
      );
    }
    
    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis2" className="px-2 text-neutral-400">...</span>
      );
    }
    
    // Always include last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className={currentPage === totalPages 
            ? "bg-msblue-primary text-white hover:bg-msblue-secondary" 
            : "border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50"}
        >
          {totalPages}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-3 flex justify-between items-center">
      <div className="text-sm text-neutral-600">
        Showing <span className="font-medium">{startItem}-{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> accounts
      </div>
      
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-neutral-300 text-neutral-500 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        
        <div className="hidden sm:flex space-x-1">
          {getPageButtons()}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
