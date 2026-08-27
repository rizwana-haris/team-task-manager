const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          TEAM PROJECT MANAGER
        </h1>

        <p className="mt-3 text-gray-600">
          Manage your projects, tasks and team progress.
        </p>

        <a
          href="/login"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          CLick Here
        </a>
      </div>
    </div>
  );
};

export default Home;