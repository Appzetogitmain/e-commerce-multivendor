import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

interface CategoryTile {
  id: string;
  name: string;
  productImages?: (string | undefined)[];
  image?: string; // Support single image property
  productCount?: number;
  categoryId?: string;
  subcategoryId?: string;
  productId?: string;
  sellerId?: string;
  bgColor?: string;
  slug?: string;
  type?: "subcategory" | "product" | "category";
}

interface CategoryTileSectionProps {
  title: string;
  tiles: CategoryTile[];
  columns?: 2 | 3 | 4 | 6 | 8; // Support all column options
  showProductCount?: boolean; // Show product count only for bestsellers
}

export default function CategoryTileSection({
  title,
  tiles,
  columns = 4,
  showProductCount = false,
}: CategoryTileSectionProps) {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [showDots, setShowDots] = useState(false);

  // We can show up to 5 dots for navigation
  const totalDots = Math.min(5, Math.ceil(tiles.length / 2));

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    if (scrollWidth <= clientWidth + 10) {
      setShowDots(false);
      return;
    }
    setShowDots(true);
    const maxScroll = scrollWidth - clientWidth;
    const percentage = scrollLeft / maxScroll;
    const index = Math.round(percentage * (totalDots - 1));
    setActiveDot(index);
  };

  useEffect(() => {
    handleScroll();
    // Add small delay to make sure layouts are loaded
    const timer = setTimeout(handleScroll, 200);
    window.addEventListener('resize', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleScroll);
    };
  }, [tiles]);

  const scrollToDot = (dotIndex: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (dotIndex / (totalDots - 1)) * maxScroll;
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const handleTileClick = (tile: CategoryTile) => {
    if (tile.subcategoryId || tile.type === "subcategory") {
      // Navigate to subcategory page or category with subcategory filter
      if (tile.categoryId) {
        navigate(
          `/category/${tile.categoryId}?subcategory=${tile.subcategoryId || tile.id
          }`
        );
      } else if (tile.slug) {
        navigate(`/category/${tile.slug}`);
      } else {
        navigate(`/category/subcategory/${tile.subcategoryId || tile.id}`);
      }
      return;
    }
    if (tile.categoryId) {
      navigate(`/category/${tile.categoryId}`);
      return;
    }
    if (tile.productId) {
      navigate(`/product/${tile.productId}`);
      return;
    }
    if ((tile as any).sellerId) {
      // Navigate to seller's products page or category
      navigate(`/seller/${(tile as any).sellerId}`);
      return;
    }
    // Otherwise just log for now
    console.log("Clicked tile", tile.id);
  };

  return (
    <div className="mb-6 md:mb-8 mt-0 overflow-visible relative">
      <h2 className="text-lg md:text-2xl font-semibold text-neutral-900 mb-3 md:mb-6 px-2 md:px-4 lg:px-4 tracking-tight">
        {title}
      </h2>
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="px-2 md:px-4 lg:px-4 overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex gap-3 md:gap-4 pb-3 pt-1">
          {tiles.map((tile) => {
            const images =
              tile.productImages || (tile.image ? [tile.image] : []);
            const hasImages = images.filter(Boolean).length > 0;
            const cardWidth = showProductCount ? "w-[200px] md:w-[240px]" : "w-[160px] md:w-[200px]";

            return (
              <motion.div
                key={tile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 ${cardWidth} flex flex-col`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <Link
                  to={
                    tile.subcategoryId || tile.type === "subcategory"
                      ? tile.categoryId
                        ? `/category/${tile.categoryId}?subcategory=${tile.subcategoryId || tile.id
                        }`
                        : tile.slug
                          ? `/category/${tile.slug}`
                          : `/category/subcategory/${tile.subcategoryId || tile.id
                          }`
                      : tile.productId
                        ? `/product/${tile.productId}`
                        : tile.type === "category"
                          ? tile.slug
                            ? `/category/${tile.slug}`
                            : tile.categoryId
                              ? `/category/${tile.categoryId}`
                              : "#"
                          : tile.categoryId
                            ? `/category/${tile.categoryId}`
                            : (tile as any).sellerId
                              ? `/seller/${(tile as any).sellerId}`
                              : "#"
                  }
                  onClick={(e) => {
                    if (
                      !tile.categoryId &&
                      !tile.productId &&
                      !tile.subcategoryId &&
                      !(tile as any).sellerId
                    ) {
                      e.preventDefault();
                      handleTileClick(tile);
                    }
                  }}
                  className={`block bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow h-full ${showProductCount ? "px-2.5 py-2" : "px-1.5 py-1.5"
                    }`}>
                  {/* Image - Single image for non-bestsellers, 2x2 grid for bestsellers */}
                  <div
                    className={`w-full rounded-lg overflow-hidden ${showProductCount ? "h-28 md:h-36 mb-2" : "aspect-square"
                      } ${tile.bgColor || "bg-cyan-50"}`}>
                    {hasImages ? (
                      showProductCount ? (
                        // Bestsellers: 2x2 grid
                        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-0.5">
                          {images.slice(0, 4).map((img, idx) =>
                            img ? (
                              <img
                                key={idx}
                                src={img}
                                alt=""
                                className="w-full h-full object-contain bg-white rounded-sm"
                                onError={(e) => {
                                  // Hide broken image
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                key={idx}
                                className="w-full h-full bg-neutral-200 rounded-sm flex items-center justify-center text-xs text-neutral-400">
                                {idx + 1}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        // Other sections: Single image - use contain to show full image without cropping
                        <img
                          src={images[0]}
                          alt={tile.name}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => {
                            // Hide broken image and show fallback
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl text-neutral-300">${tile.name.charAt(0)}</div>`;
                            }
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-neutral-300">
                        {tile.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Product count - shown first (only for bestsellers) */}
                  {showProductCount && tile.productCount && (
                    <div className="mb-1.5 flex justify-center">
                      <span className="inline-block bg-neutral-100 text-neutral-600 text-[10px] font-medium px-2 py-0.5 rounded-full leading-tight">
                        +{tile.productCount} more
                      </span>
                    </div>
                  )}

                  {/* Tile name - inside card only for bestsellers */}
                  {showProductCount && (
                    <div className="text-[11px] font-semibold text-neutral-900 line-clamp-2 leading-tight text-center w-full block">
                      {tile.name}
                    </div>
                  )}
                </Link>

                {/* Category name - outside card for non-bestsellers */}
                {!showProductCount && (
                  <div className="mt-1.5 text-center px-1">
                    <span className="text-xs font-semibold text-neutral-900 line-clamp-2 leading-tight block min-h-[2rem]">
                      {tile.name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination / Scroll Indicator Dots */}
      {showDots && totalDots > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-2">
          {[...Array(totalDots)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToDot(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeDot === idx 
                  ? 'w-5 bg-[var(--customer-primary)]' 
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
