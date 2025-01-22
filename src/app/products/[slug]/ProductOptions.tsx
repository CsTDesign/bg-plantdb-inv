import { Label } from "@/components/ui/label";
import { checkInStock, cn } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export default function ProductOptions(
  { product, selectedOptions, setSelectedOptions }: ProductOptionsProps
) {
  return (
    <div className="space-y-2.5">
      {
        product.productOptions?.map((option) => (
          <fieldset
            className="space-y-1.5"
            key={option.name}
          >
            <legend>
              <Label asChild>
                <span>
                  {option.name}
                </span>
              </Label>
            </legend>
            <div className="flex flex-wrap gap-1.5 items-center">
              {
                option.choices?.map((choice) => (
                  <div key={choice.description}>
                    <input
                      checked={
                        selectedOptions[option.name || ""] === choice.description
                      }
                      className="hidden peer"
                      id={choice.description}
                      name={option.name}
                      onChange={() => setSelectedOptions({
                        ...selectedOptions,
                        [option.name || ""]: choice.description || ""
                      })}
                      type="radio"
                      value={choice.description}
                    />
                    <Label
                      className={cn(
                        "border cursor-pointer flex gap-1.5 items-center justify-center min-w-14 p-2 peer-checked:border-primary",
                        !checkInStock(product, {
                          ...selectedOptions,
                          [option.name || ""]: choice.description || "",
                        }) && "opacity-50"
                      )}
                      htmlFor={choice.description}
                    >
                      {
                        option.optionType === products.OptionType.color && (
                          <span
                            className="border rounded-full size-4"
                            style={{
                              backgroundColor: choice.value
                            }}
                          />
                        )
                      }
                      <span>
                        {choice.description}
                      </span>
                    </Label>
                  </div>
                ))
              }
            </div>
          </fieldset>
        ))
      }
    </div>
  );
}
