import React from "react";

function InputComp({
  type,
  placeholder,
  name,
  value,
  onChangeFn,
  error,
  disabled,
}) {
  return (
    <div className="inp">
      <input
        className="border p-3 rounded w-full"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={(e) => onChangeFn(name, e.target.value)}
      />
      {error && (
        <p className="text-center text-red-400 text-sm max-w-60">{error}</p>
      )}
    </div>
  );
}

export default InputComp;
