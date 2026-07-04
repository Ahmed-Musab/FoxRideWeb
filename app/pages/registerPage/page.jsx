import Register from "@/app/components/Register";

export const metadata = {
  title: "Register",
  icons: {
    icon: '/favIcon2.png',
  },
};

const page = () => {
  return (
    <div>
      <Register/>
    </div>
  )
}

export default page