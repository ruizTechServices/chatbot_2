import AuthSection from "@/components/main/AuthSection";
import Checklist from "@/components/main/Checklist";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin page</h1>
      <div className="p-6">
            <AuthSection />
            <Checklist />
          </div>
    </div>
  );
}
