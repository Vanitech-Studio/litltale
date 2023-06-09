import Link  from "next/link"; 
import { Span } from "./styles";
import Text from "../Text";

const Button = ({label, link, onClick, onChange, disabled, children, size, target, className}) => {
  return (

    <button onClick={onClick} onChange={onChange} disabled={disabled} size={size} className={`${className} w-full md:w-48 relative p-0.5 my-2 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md`}>
    <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
    <span className="relative px-6 py-3 transition-all ease-out bg-transparent rounded-md group-hover:bg-opacity-0 duration-400">
      <span className="relative">
        {link ? 
          <Link target={target ? "_blank" : ""} href={link}>
            <Span>
              <Text size="sm" className={children ? "mr-2" : ""}>
              {label ? label : ""}
              </Text>
              {children ? children : ""}
            </Span>
          </Link>
        :
          <Span>
            <Text size="sm" className={children ? "mr-2" : ""}>
                {label ? label : ""}
            </Text>
            {children ? children : ""}
          </Span>
        }
      </span>   
    </span>
    </button>
    
  );
}

export default Button;
