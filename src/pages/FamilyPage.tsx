import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Plus, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";

interface FamilyMember {
  id: string;
  user_id: string;
  role: "admin" | "member";
  user: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

interface Family {
  id: string;
  name: string;
  created_by: string;
}

export const FamilyPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchFamily = async () => {
      try {
        const { data: memberData, error: memberError } = await supabase
          .from("family_members")
          .select("family_id")
          .eq("user_id", user.id)
          .single();

        if (memberError && memberError.code !== "PGRST116") throw memberError;

        if (memberData) {
          const { data: familyData, error: familyError } = await supabase
            .from("families")
            .select("*")
            .eq("id", memberData.family_id)
            .single();

          if (familyError) throw familyError;
          setFamily(familyData);

          const { data: membersData, error: membersError } = await supabase
            .from("family_members")
            .select(`*, user:users(full_name, email, avatar_url)`)
            .eq("family_id", memberData.family_id);

          if (membersError) throw membersError;
          setMembers(membersData || []);
        }
      } catch (error) {
        console.error("Error fetching family:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [user]);

  const handleCreateFamily = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const { data: familyData, error: familyError } = await supabase
        .from("families")
        .insert({ name, created_by: user.id })
        .select()
        .single();

      if (familyError) throw familyError;

      const { error: memberError } = await supabase
        .from("family_members")
        .insert({
          family_id: familyData.id,
          user_id: user.id,
          role: "admin",
        });

      if (memberError) throw memberError;

      setFamily(familyData);
      setIsCreateModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating family:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!family) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
        <div className="p-6 bg-blue-50 rounded-full">
          <Users className="w-16 h-16 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">No Family Group</h2>
          <p className="text-gray-500 max-w-md mt-2">
            Create a family group to share expenses and manage budget together
            with your family members.
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Create Family Group
        </Button>

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Family Group"
        >
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <Input
              name="name"
              label="Family Name"
              placeholder="e.g. Rahman Family"
              required
            />
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{family.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{members.length} সদস্য</p>
        </div>
        <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          সদস্য আমন্ত্রণ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {member.user?.full_name?.[0] || member.user?.email?.[0] || "?"}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {member.user?.full_name || "Unknown"}
              </h3>
              <p className="text-xs text-gray-500">
                {member.role === "admin" ? "অ্যাডমিন" : "সদস্য"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Member"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            To invite a member, ask them to sign up with their email. Then you
            can add them here. (Feature to be implemented: Email invitation)
          </p>
          <Input label="Member Email" placeholder="member@example.com" />
          <Button className="w-full">Send Invite</Button>
        </div>
      </Modal>
    </div>
  );
};
