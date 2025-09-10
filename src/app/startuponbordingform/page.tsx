import { insertForm } from "./actions"

export default function StartupOnboardingForm() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Startup Onboarding Form</h1>

      {/* 👇 Important: wire form to server action */}
      <form action={insertForm} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          name="label"
          placeholder="Label"
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Form
        </button>
      </form>
    </div>
  )
}
 