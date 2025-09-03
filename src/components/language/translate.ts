import translate from "translate";
const translateText = async (val: any) => {
    try {        
        let data = await translate(val, { from: "en", to: 'ml' });
        return data
    } catch (err) {
        console.error("Translation error:", err);
    }
}
export {translateText};
