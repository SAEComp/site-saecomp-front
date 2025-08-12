interface IMark {
    marked: boolean
}

const Mark = ({marked}: IMark) => {
    return(
        <div
        className="w-8 h-8 rounded-full bg-[#F2F2F2] ml-2 mt-1 border-[6px] border-[#D9D9D9] text-center"
        >
            {marked && (<div
            className= "w-[80%] h-[80%] p-1 ml-[10%] mt-[10%] rounded-full bg-[#03B04B]"
            />)}
        </div>
    )
}

export default Mark;