import { supabase } from "./supabase.js";

const connectDB = async () => {
    try {
        const { error } = await supabase
            .from("users")
            .select("id")
            .limit(1);
        if (error) {
            console.log("Supabase connection failed:", error.message);
        } else {
            console.log("Supabase connected successfully");
        }
    } catch (error) {
        console.log("Supabase connection failed:", error.message);
    }
};

export default connectDB;
