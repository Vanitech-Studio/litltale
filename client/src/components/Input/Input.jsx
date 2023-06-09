
const Input = ({ onChange, placeholder, value, displayvalue, className, width, onKeyPress }) => {
  return (
      <input onChange={onChange} value={value} displayvalue={displayvalue} onKeyPress={onKeyPress} placeholder={placeholder} className={`${className} ${width} outline-none px-3 py-2 rounded-md border border-white text-white bg-transparent`}/>
  );
}

export default Input;
