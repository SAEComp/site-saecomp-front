import {
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import { useSprings, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";

interface AnimatedCarouselProps {
    index: number;
    setIndex: (i: number) => void;
    children: ReactNode[];
    lockBodyScroll?: boolean;
    className?: string;
}

const AnimatedCarousel: React.FC<AnimatedCarouselProps> = ({
    index,
    setIndex,
    children,
    lockBodyScroll = true,
    className = "",
}) => {
    const slideRef = useRef<HTMLDivElement | null>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const [vw, setVw] = useState(() => window.innerWidth);

    useEffect(() => {
        const onResize = () => setVw(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!slideRef.current) return;

        const el = slideRef.current;
        setContainerHeight(el.getBoundingClientRect().height);

        const ro = new ResizeObserver(([entry]) => {
            setContainerHeight(entry.contentRect.height);
        });
        ro.observe(el);

        return () => ro.disconnect();
    }, [index]);

    const totalSlides = children.length;
    const [springs, api] = useSprings(
        totalSlides,
        (i) => ({
            x: (i - index) * vw,
            display: "block",
            immediate: vw === 0,
        }),
        [vw, index]
    );

    const bind = useDrag(
        ({
            active,
            movement: [mx],
            direction: [xDir],
            distance,
            velocity,
            memo = index,
            cancel,
        }) => {
            if (lockBodyScroll) {
                document.body.style.overflow = active ? "hidden" : "auto";
            }

            const dir = xDir > 0 ? -1 : 1;
            const candidate = memo + dir;
            const trigger = velocity > 0.2 || distance > vw / 3;

            if (!active && trigger && candidate >= 0 && candidate < totalSlides) {
                setIndex(candidate);
                cancel?.();
            }

            api.start((i) => {
                if (i < index - 1 || i > index + 1) return { display: "none" };

                let x = (i - index) * vw + (active ? mx : 0);
                if ((index === 0 && mx > 0) || (index === totalSlides - 1 && mx < 0)) {
                    x = (i - index) * vw;
                }
                return { x, display: "block" };
            });

            return memo;
        },
        { axis: "x", filterTaps: true, pointer: { touch: true } }
    );

    return (
        <div
            className={`relative w-full overflow-hidden ${className}`}
            style={{ minHeight: containerHeight }}
            {...bind()}
        >
            {springs.map(({ x, display }, i) => (
                <animated.div
                    key={i}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        willChange: "transform",
                        transform: x.to((px) => `translate3d(${px}px,0,0)`),
                        display,
                    }}
                >
                    <div ref={i === index ? slideRef : null}>{children[i]}</div>
                </animated.div>
            ))}
        </div>
    );
};

export default AnimatedCarousel;
