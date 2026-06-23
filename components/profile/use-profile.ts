import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  ProfileField,
  ProfileDetails,
} from "@/components/profile/profile-types";
import { supabase } from "@/src/lib/supabase";

const INITIAL_PROFILE: ProfileDetails = {
  name: "",
  email: "",
  gender: "Not set",
  dob: "Not set",
};

type InitialProfile = Pick<ProfileDetails, "email" | "name">;

export function useProfile(initialProfile?: InitialProfile) {
  const [profile, setProfile] = useState<ProfileDetails>(() => ({
    ...INITIAL_PROFILE,
    ...initialProfile,
  }));

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", user.id)
        .single();

      setProfile((current) => ({
        ...current,
        name: data?.username ?? user.user_metadata?.username ?? "User",
        email: data?.email ?? user.email ?? "",
      }));
    };

    void fetchProfile();
  }, []);

  const updateProfile = (field: ProfileField, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const deleteAccount = async () => {
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      Alert.alert("Unable to delete account", error.message);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return {
    deleteAccount,
    profile,
    updateProfile,
  };
}
