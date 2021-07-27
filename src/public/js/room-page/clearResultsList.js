export const clearResultsList = () => {
  const resultsList = document.getElementById("results-list");

  while (resultsList && resultsList.lastChild) {
    resultsList.removeChild(resultsList.lastChild);
  }

  return resultsList;
};

export default clearResultsList;
