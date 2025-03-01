export default function UserProfile({ params }: any) {//to grab params
  return (//if we type something in url that page opens grabbing that as id
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">
        Profile page
        <span className="p-2 ml-2 rounded bg-orange-500 text-black">{params.id}</span>
      </p>
    </div>
  );
}
