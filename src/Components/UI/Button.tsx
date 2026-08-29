//Re-Usable button

interface ButtonProps {
  text : string;
}

const Button = ({text}:ButtonProps) => {
  return (
    <div>
        <button className="bg-white tracking-tight text-md font-bold px-5 py-2 rounded-lg cursor-pointer whitespace-nowrap">
           {text}
        </button>
    </div>
  )
}

export default Button