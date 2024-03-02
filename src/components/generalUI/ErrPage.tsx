import { useRouteError } from "react-router-dom";

export const ErrPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>Error</h1>
      <p>エラーが発生しました</p>
      {/* {<p>
        <i>{error.statusText || error.message}</i>
      </p>} */}
    </div>
  );
};
