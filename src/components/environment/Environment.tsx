// export const Environment = () => {
//   const animals = [
//     { id: "animal1" },
//     { id: "animal2" },
//     { id: "animal3" },
//     { id: "animal4" },
//     { id: "animal5" },
//     { id: "animal6" },
//     { id: "animal7" },
//     { id: "animal8" },
//   ];

//   const pairs = [
//     { id: "pair1", pair: ["animal1", "animal2"] },
//     { id: "pair2", pair: ["animal3", "animal4"] },
//   ];

//   const brothers = [
//     { id: "brothers1", brothers: ["animal5", "animal6"] },
//     { id: "brothers2", brothers: ["animal7", "animal8"] },
//   ];

//   const breedings = [
//     {
//       id: "breeding1",
//       pair: "pair1",
//       children: "brothers1",
//     },
//     {
//       id: "breeding2",
//       pair: "pair2",
//       children: "brothers2",
//     },
//   ];

//   const title = "text-base font-bold pb-2";

//   return (
//     <div>
//       {/* animals */}
//       <div>
//         <div className={title}>animals</div>
//         <div>
//           {animals.map((animal, i) => (
//             <div key={i}>{animal.id}</div>
//           ))}
//         </div>
//       </div>
//       {/* animals */}
//       <div>
//         <div className={title}>animals</div>
//         <div>
//           {pairs.map((pair, i) => (
//             <div key={i}>{`${pair.id}: ${pair.pair}`}</div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
