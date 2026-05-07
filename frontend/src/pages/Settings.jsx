import { Camera, Lock, Trash2, Mail, Globe2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="min-h-screen bg-memento-cream" data-testid="settings-page">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-3">
          Settings
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-memento-espresso tracking-tight mb-12">
          Make it yours.
        </h1>

        {/* Profile */}
        <section className="bg-white rounded-3xl p-7 lg:p-9 border border-memento-parchment mb-6">
          <h2 className="font-serif text-2xl text-memento-espresso mb-6">
            Profile
          </h2>
          <div className="flex items-center gap-5 mb-7">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-memento-sand flex items-center justify-center font-serif text-3xl text-memento-espresso">
                JS
              </div>
              <button
                data-testid="settings-avatar-upload"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-memento-terracotta text-white flex items-center justify-center shadow-md hover:bg-memento-terracotta-dark"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="font-medium text-memento-espresso">Jordan Smith</p>
              <p className="text-sm text-memento-coffee">jordan@memento.app</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                First name
              </Label>
              <Input
                id="firstName"
                data-testid="settings-firstname"
                defaultValue="Jordan"
                className="mt-1.5 h-11 rounded-xl border-memento-parchment"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                Last name
              </Label>
              <Input
                id="lastName"
                data-testid="settings-lastname"
                defaultValue="Smith"
                className="mt-1.5 h-11 rounded-xl border-memento-parchment"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-memento-coffee font-semibold">
                Email
              </Label>
              <Input
                id="email"
                data-testid="settings-email"
                defaultValue="jordan@memento.app"
                className="mt-1.5 h-11 rounded-xl border-memento-parchment"
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-3xl p-7 lg:p-9 border border-memento-parchment mb-6">
          <h2 className="font-serif text-2xl text-memento-espresso mb-6">
            Preferences
          </h2>
          <div className="space-y-5">
            <ToggleRow
              icon={Sparkles}
              title="Smart hacks"
              desc="Surface money & time-saving tips inside every itinerary."
              defaultChecked={true}
              testid="settings-toggle-hacks"
            />
            <Separator className="bg-memento-parchment" />
            <ToggleRow
              icon={Mail}
              title="Trip reminder emails"
              desc="A nudge 7 days before your trip with last-minute tips."
              defaultChecked={true}
              testid="settings-toggle-emails"
            />
            <Separator className="bg-memento-parchment" />
            <ToggleRow
              icon={Globe2}
              title="Currency in local"
              desc="Show prices in destination currency instead of USD."
              defaultChecked={false}
              testid="settings-toggle-currency"
            />
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-white rounded-3xl p-7 lg:p-9 border border-memento-parchment mb-6">
          <h2 className="font-serif text-2xl text-memento-espresso mb-2">
            Privacy
          </h2>
          <p className="text-sm text-memento-coffee mb-6">
            Memento is private by default. Nothing is shared without your say-so.
          </p>
          <div className="space-y-3">
            <Button
              variant="ghost"
              data-testid="settings-download-data"
              className="w-full justify-start h-12 rounded-2xl text-memento-espresso hover:bg-memento-sand"
            >
              <Lock className="w-4 h-4 mr-3 text-memento-coffee" />
              Download my data
            </Button>
            <Button
              variant="ghost"
              data-testid="settings-delete-account"
              className="w-full justify-start h-12 rounded-2xl text-[#A84A33] hover:bg-[#FBE9DF]"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete my account
            </Button>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            data-testid="settings-cancel"
            className="rounded-full px-6 text-memento-coffee hover:bg-memento-sand"
          >
            Cancel
          </Button>
          <Button
            data-testid="settings-save"
            className="bg-memento-terracotta hover:bg-memento-terracotta-dark text-white rounded-full h-11 px-7"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ icon: Icon, title, desc, defaultChecked, testid }) => (
  <div className="flex items-center justify-between gap-5">
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-memento-sand flex items-center justify-center text-memento-terracotta shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-medium text-memento-espresso">{title}</p>
        <p className="text-xs text-memento-coffee mt-0.5">{desc}</p>
      </div>
    </div>
    <Switch defaultChecked={defaultChecked} data-testid={testid} />
  </div>
);

export default Settings;
