import Carousel from "./Carousel";


function CarouselTest() {
    const items = [
        { text: "slide 1"},
        { text: "slide 2"},
        { text: "slide 3"},
        { text: "slide 4"},
        { text: "slide 5"},
    ]
    return (
        <div className="flex flex-col justify-center items-center flex-grow w-screen h-screen">
            <Carousel>
                {items.map((el, i) => (
                    <div key={i} className="h-40 w-40 bg-amber-600 flex justify-center items-center">
                        {el.text}
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
export default CarouselTest;