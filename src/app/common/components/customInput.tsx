export function Input(
  props: {
    error: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      className={props.error ? "error" : undefined}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export function generateOnChangeHandler(
  key: string,
  setUrlParams: React.Dispatch<React.SetStateAction<Map<string, string>>>,
  setFieldsWithErrors: React.Dispatch<React.SetStateAction<Set<string>>>,
  validator?: (value: string) => boolean,
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlParams((prev) => new Map(prev).set(key, e.target.value));
    if (!validator) {
      return;
    }
    if (!validator(e.target.value)) {
      setFieldsWithErrors((prev) => {
        const newSet = new Set(prev);
        newSet.add(key);
        return newSet;
      });
    } else {
      setFieldsWithErrors((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };
}
