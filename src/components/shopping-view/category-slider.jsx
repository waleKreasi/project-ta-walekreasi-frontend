import { useNavigate, useSearchParams } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { cn } from "@/lib/utils";

function CategorySlider() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const categories = [
    { id: "all", label: "Semua" },
    ...shoppingViewHeaderMenuItems.map(({ id, label }) => ({
      id,
      label,
    })),
  ];

  const handleCategoryClick = (categoryId) => {
    const params = new URLSearchParams();

    if (categoryId !== "all") {
      params.set("category", categoryId);
    }

    navigate({
      pathname: "/shop/listing",
      search: params.toString(),
    });
  };

  return (
    <div className="overflow-x-auto no-scrollbar -mx-2 px-2">
      <div className="flex space-x-2">
        {categories.map((category) => {
          const isActive = category.id === selectedCategory || (category.id === "all" && !selectedCategory);

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "whitespace-nowrap border rounded-full px-4 py-1 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySlider;
