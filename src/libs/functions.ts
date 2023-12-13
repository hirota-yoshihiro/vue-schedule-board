const getWindowSize = (reactiveData: any) => {
  reactiveData.inner_width = window.innerWidth;
  reactiveData.inner_height = window.innerHeight;
};

export { getWindowSize };
