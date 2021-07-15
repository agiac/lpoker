export const clearResultsList = () => {
  const resultsList = document.getElementById("results-list");

  while (resultsList.children.length > 0) {
    resultsList.removeChild(resultsList.lastChild);
  }

  return resultsList;
};

export default clearResultsList;
