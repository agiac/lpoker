// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId, __roomId__: roomId } = window;

const onVoteSubmit = (socket) => (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const vote = formData.get("vote");

  socket.send(
    JSON.stringify({
      event: "vote",
      data: {
        userId,
        roomId,
        vote,
      },
    })
  );
};

const onShowResultsClick = (socket) => (e) => {
  e.preventDefault();

  socket.send(
    JSON.stringify({
      event: "show-results",
      data: {
        roomId,
      },
    })
  );
};

const onStartNewSessionClick = (socket) => (e) => {
  e.preventDefault();

  socket.send(
    JSON.stringify({
      event: "new-session",
      data: {
        roomId,
      },
    })
  );
};

export const addEventListeners = (socket) => {
  const votingForm = document.getElementById("voting-form");
  votingForm.addEventListener("submit", onVoteSubmit(socket));

  const showResultsButton = document.getElementById("show-results");
  showResultsButton.addEventListener("click", onShowResultsClick(socket));

  const startNewSessionBUtton = document.getElementById("start-new-session");
  startNewSessionBUtton.addEventListener(
    "click",
    onStartNewSessionClick(socket)
  );
};

export default addEventListeners;
