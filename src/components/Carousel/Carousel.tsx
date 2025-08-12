import { useEffect, useLayoutEffect, useRef, useCallback, useState } from 'react';

interface ICarousel {
    children: React.ReactNode[];
}


function Carousel({ children }: ICarousel) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const itemsContainerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    const [itemWidth, setItemWidth] = useState<number>(0);

    const pos = useRef({
        x1: 0,
        x2: 0,
        initial: 0,
        final: 0,
    });

    const dragStart = useCallback((e: TouchEvent | MouseEvent) => {
        e.preventDefault();
        pos.current.initial = itemsContainerRef.current?.offsetLeft || 0;
        pos.current.x1 = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
    }, []);

    const dragAction = useCallback((e: TouchEvent | MouseEvent) => {
        const x = e instanceof TouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
        pos.current.x2 = pos.current.x1 - x;
        pos.current.x1 = x;
        itemsContainerRef.current!.style.transform = `translateX(${itemsContainerRef!.current!.offsetLeft - pos.current.x2}px)`;
    }, []);


    useEffect(() => {
        if (!wrapperRef.current || !itemsContainerRef.current) return;
        const firstItem = itemsRef.current[0];
        if (firstItem) {
            setItemWidth(firstItem.offsetWidth);
        }


        if (children.length > 1) {
            const firstClone = (itemsContainerRef.current.children[0] as HTMLElement).cloneNode(true);
            const lastClone = (itemsContainerRef.current.children[children.length - 1] as HTMLElement).cloneNode(true);
            itemsContainerRef.current.appendChild(firstClone);
            itemsContainerRef.current.prepend(lastClone);
        }

        wrapperRef.current.addEventListener('touchstart', dragStart);
        wrapperRef.current.addEventListener('touchmove', dragAction);

        return () => {
            wrapperRef.current?.removeEventListener('touchstart', dragStart);
            wrapperRef.current?.removeEventListener('touchmove', dragAction);
        }

    }, [children.length]);


    return (
        <div ref={wrapperRef} className="flex overflow-hidden" style={{
            width: itemWidth ? `${itemWidth}px` : '100%'
        }}>
            <div ref={itemsContainerRef} className="flex">
                {children.map((el, i) => (
                    <div key={i} ref={(el) => (itemsRef.current[i] = el)}>
                        {el}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Carousel;

