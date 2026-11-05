import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { api } from "../lib/api";
import { uploadImage } from "../lib/uploadImage";
import { AuthContext } from "./AuthContext";

/**
 * Two layers of identity:
 *  - `user`    – the Firebase account (who you are)
 *  - `profile` – the TaskWave record with your role (what you can do)
 * `profile === null` with `status === "ready"` means signed in but no role chosen yet.
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const registering = useRef(false);

  const loadProfile = useCallback(async () => {
    setStatus("loading");
    try {
      setProfile(await api.get("/users/me"));
      setStatus("ready");
    } catch (e) {
      if (e.status === 404 || e.code === "NO_PROFILE") {
        setProfile(null);
        setStatus("ready");
      } else if (e.code === "SUSPENDED") {
        await signOut(auth);
        setProfile(null);
        setStatus("ready");
        throw e;
      } else {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      if (!current) {
        setProfile(null);
        setStatus("ready");
        return;
      }
      if (registering.current) return; // sign-up flow creates the profile itself
      loadProfile().catch(() => {});
    });
    return unsubscribe;
  }, [loadProfile]);

  const registerProfile = useCallback(async ({ role, name, photo }) => {
    const created = await api.post("/users/register", { role, name, photo });
    setProfile(created);
    setStatus("ready");
    return created;
  }, []);

  /** Creates the account, uploads the optional photo file, then creates the TaskWave profile. */
  const signUp = useCallback(
    async ({ name, email, password, photoFile, role }) => {
      registering.current = true;
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        let photo;
        let photoFailed = false;
        if (photoFile) {
          try {
            photo = await uploadImage(photoFile);
          } catch {
            photoFailed = true;
          }
        }
        await updateProfile(cred.user, {
          displayName: name,
          photoURL: photo || null,
        });
        setUser(auth.currentUser);
        const profile = await registerProfile({ role, name, photo });
        return { profile, photoFailed };
      } finally {
        registering.current = false;
      }
    },
    [registerProfile],
  );

  const loginUser = useCallback(
    (email, password) => signInWithEmailAndPassword(auth, email, password),
    [],
  );

  /** With a role (register page) the profile is created right away; without one the user is sent to onboarding if new. */
  const googleLogin = useCallback(
    async (role) => {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      registering.current = !!role;
      try {
        const cred = await signInWithPopup(auth, provider);
        setUser(cred.user);
        if (role) await registerProfile({ role });
        return cred;
      } finally {
        registering.current = false;
      }
    },
    [registerProfile],
  );

  const updateMyProfile = useCallback(async (patch) => {
    const updated = await api.patch("/users/me", patch);
    setProfile(updated);
    if (
      auth.currentUser &&
      (patch.name !== undefined || patch.photo !== undefined)
    ) {
      await updateProfile(auth.currentUser, {
        displayName: updated.name,
        photoURL: updated.photo || null,
      });
      setUser(auth.currentUser);
    }
    return updated;
  }, []);

  const logoutUser = useCallback(() => signOut(auth), []);

  const value = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role || null,
      status,
      loading: status === "loading",
      needsOnboarding: !!user && status === "ready" && !profile,
      signUp,
      loginUser,
      googleLogin,
      registerProfile,
      updateMyProfile,
      logoutUser,
      reloadProfile: loadProfile,
    }),
    [
      user,
      profile,
      status,
      signUp,
      loginUser,
      googleLogin,
      registerProfile,
      updateMyProfile,
      logoutUser,
      loadProfile,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

export default AuthProvider;