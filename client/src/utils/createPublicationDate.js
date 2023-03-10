const createPublicationDate = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const publicationDate = today.toLocaleDateString(); // "06.14.2020"
  return publicationDate;
};

export default createPublicationDate;
