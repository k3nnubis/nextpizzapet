import { cn } from "@/shared/lib/utils";
import { PizzaImage } from "./pizza-image";
import { Title } from "./title";
import { Button } from "../ui";
import { VariantsSelector } from "./variants-selector";
import { Ingredient, ProductItem } from "@/src/generated/prisma/client";
import { IngredientCard } from "./ingredient-card";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { usePizzaOptions } from "@/shared/hooks/use-pizza-options";
import { calcTotalPizzaPrice } from "@/shared/lib";
import { LoaderCircle } from "lucide-react";

interface ChoosePizzaFormProps {
  name: string;
  imageUrl: string;
  ingredients: Ingredient[];
  variants: ProductItem[];
  onSubmit: (itemId: number, ingredients: number[]) => void;
  className?: string;
  loading?: boolean;
}
export function ChoosePizzaForm({
  name,
  variants,
  imageUrl,
  ingredients,
  loading,
  onSubmit,
}: ChoosePizzaFormProps) {
  const {
    size,
    type,
    pizzaTypes,
    textDetails,
    addIngredient,
    setPizzaSize,
    setPizzaType,
    selectedIngredients,
    currentItemId,
    availablePizzaSizes,
  } = usePizzaOptions({ variants });

  const totalPrice = calcTotalPizzaPrice(variants, ingredients, selectedIngredients, size, type);

  const handleSubmit = () => {
    if (!currentItemId) return;
    onSubmit(currentItemId, Array.from(selectedIngredients));
  };

  return (
    <div className={cn("flex flex-1")}>
      <PizzaImage imageUrl={imageUrl} size={size} productName={name} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="mb-1 font-extrabold" />

        <p className="text-gray-400">{textDetails}</p>

        <div className="mt-10 flex flex-col gap-4">
          <VariantsSelector items={availablePizzaSizes} selectedValue={String(size)} onClick={setPizzaSize} />

          <VariantsSelector items={pizzaTypes} selectedValue={String(type)} onClick={setPizzaType} />
        </div>

        {ingredients.length && (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white px-1 py-1">
            <Title text="Добавить по вкусу" size="xs" className="text-[18px] font-bold" />
            <Carousel opts={{ align: "start" }}>
              <CarouselContent className="-ml-[14px] pb-1">
                {ingredients.map((ingredient) => (
                  <CarouselItem key={ingredient.id} className="basis-1/3 pl-[14px]">
                    <IngredientCard
                      name={ingredient.name}
                      imageUrl={ingredient.imageUrl}
                      price={ingredient.price}
                      id={ingredient.id}
                      active={selectedIngredients.has(ingredient.id)}
                      onClick={() => addIngredient(ingredient.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          className={cn(
            "mt-10 h-[55px] w-full rounded-[18px] px-10 text-base transition-all duration-300",
            loading && "bg-black",
          )}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="ml-3 animate-spin" size={16} />
          ) : (
            `Добавить в корзину за ${totalPrice} ₽`
          )}
        </Button>
      </div>
    </div>
  );
}
