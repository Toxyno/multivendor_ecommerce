// "use client";

// import { useEffect, useState } from "react";

// const useFromStore = <T, F>(
//   store: (callback: (state: T) => unknown) => unknown,
//   storeCallBack: (state: T) => F,
// ) => {
//   const [state, setState] = useState<F>();
//   const stateOfStore = store(storeCallBack) as F;

//   useEffect(() => {
//     setState(stateOfStore);
//   }, [stateOfStore]);
//   return state;
// };

// export default useFromStore;

"use client";

import { useEffect, useState } from "react";

const useFromStore = <T, F>(
  store: (selector: (state: T) => F) => F,
  selector: (state: T) => F,
  fallback: F,
): F => {
  const selected = store(selector);
  const [state, setState] = useState<F>(fallback);

  useEffect(() => {
    setState(selected);
  }, [selected]);

  return state;
};

export default useFromStore;
