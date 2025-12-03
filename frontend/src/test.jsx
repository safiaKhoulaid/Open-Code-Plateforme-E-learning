 export function Component() {
    const maFonction = () => console.log("Hello");
  
    useEffect(() => {
      maFonction();
    }, [maFonction]);
  }
  