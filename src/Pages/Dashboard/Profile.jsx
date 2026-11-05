import { useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { toast } from "react-toastify";
import { useAuth } from "../../Authentication/useAuth";
import { useTheme } from "../../context/useTheme";
import { ROLE_LABEL } from "../../lib/constants";
import PageHeader from "../../Components/ui/PageHeader";
import Section from "../../Components/ui/Section";
import Field from "../../Components/ui/Field";
import PhotoPicker from "../../Components/ui/PhotoPicker";
import { uploadImage } from "../../lib/uploadImage";

const Profile = () => {
  const { profile, user, updateMyProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({
    name: profile.name || "",
    headline: profile.headline || "",
    location: profile.location || "",
    bio: profile.bio || "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = "Enter your name.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await updateMyProfile(form);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  // The photo is saved as soon as the upload finishes, independently of the text fields.
  const changePhoto = async (file) => {
    setPhotoBusy(true);
    try {
      const url = await uploadImage(file);
      await updateMyProfile({ photo: url });
      toast.success("Photo updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPhotoBusy(false);
    }
  };
  const removePhoto = async () => {
    setPhotoBusy(true);
    try {
      await updateMyProfile({ photo: "" });
      toast.success("Photo removed");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPhotoBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="How you appear to clients and freelancers."
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] items-start">
        <form
          onSubmit={submit}
          noValidate
          className="card card-pad !p-5 sm:!p-6 grid gap-5 sm:grid-cols-2 min-w-0"
        >
          <div className="sm:col-span-2">
            <PhotoPicker
              name={form.name}
              src={profile.photo}
              busy={photoBusy}
              onSelect={changePhoto}
              onRemove={removePhoto}
            />
          </div>
          <Field label="Full name" error={errors.name}>
            {(p) => (
              <input
                {...p}
                className="input"
                value={form.name}
                onChange={set("name")}
                maxLength={80}
              />
            )}
          </Field>
          <Field
            label="Headline"
            optional
            hint={
              profile.role === "freelancer"
                ? "Shown on your proposals, e.g. Full-stack developer"
                : "e.g. Founder at Acme"
            }
          >
            {(p) => (
              <input
                {...p}
                className="input"
                value={form.headline}
                onChange={set("headline")}
                maxLength={100}
              />
            )}
          </Field>
          <Field label="Location" optional>
            {(p) => (
              <input
                {...p}
                className="input"
                value={form.location}
                onChange={set("location")}
                maxLength={80}
              />
            )}
          </Field>
          <Field
            label="About you"
            optional
            className="sm:col-span-2"
            hint={`${form.bio.length}/1000`}
          >
            {(p) => (
              <textarea
                {...p}
                className="textarea"
                value={form.bio}
                onChange={set("bio")}
                maxLength={1000}
              />
            )}
          </Field>
          <div className="sm:col-span-2 flex justify-end pt-2 border-t border-line">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
        <div className="space-y-4 min-w-0">
          <Section title="Account">
            <dl className="m-0 divide-y divide-line -mt-1 text-sm">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Role</dt>
                <dd className="m-0 font-medium">{ROLE_LABEL[profile.role]}</dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted">Email</dt>
                <dd className="m-0 font-medium truncate">{user.email}</dd>
              </div>
            </dl>
          </Section>
          <Section
            title="Appearance"
            description="Choose how TaskWave looks on this device."
          >
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Theme"
            >
              {[
                ["light", "Light", LuSun],
                ["dark", "Dark", LuMoon],
              ].map(([v, label, Icon]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={theme === v}
                  onClick={() => setTheme(v)}
                  className={`btn ${theme === v ? "btn-primary" : "btn-outline"}`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
};

export default Profile;