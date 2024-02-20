export const ValidationErrMsgs = ({ msgs }: { msgs: string[] }) => {
  return (
    <>
      {msgs.length > 0 && (
        <ul>
          {msgs.map((msg, i) => (
            <li key={i} className="text-xs text-red-500 list-disc list-inside">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
