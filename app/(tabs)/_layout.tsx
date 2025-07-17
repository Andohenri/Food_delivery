import { Redirect, Slot } from 'expo-router';

const TabsLayout = () => {
  const isauthentcated = false;
  if(!isauthentcated) return <Redirect href={"/sign-in"} />
  return <Slot />
}

export default TabsLayout