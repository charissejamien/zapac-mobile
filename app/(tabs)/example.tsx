import { supabase } from "@/src/lib/supabase";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function App() {
  useEffect(() => {
    console.log("TESTING SUPABASE NOW..."); // Add this line
    async function testConnection() {
      const { data, error } = await supabase
        .from("your_table")
        .select("*")
        .limit(1);
      if (error) console.log("ERROR:", error.message);
      else console.log("SUCCESS:", data);
    }
    testConnection();
  }, []);

  return (
    <View>
      <Text>Testing Supabase...</Text>
    </View>
  );
}
