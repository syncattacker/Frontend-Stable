"use client";
import { withAuth } from "@/utils/withAuth";

export default withAuth(function Labs() {
  return (
    <div className="min-h-screen bg-black text-white font-roundo">
      <div className="flex items-center justify-center min-h-screen px-10 flex-col">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-zinc-300">
            Coming Soon
          </h1>

          <div className="space-y-4">
            <div className="w-24 h-1 bg-zinc-700 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-300">
              Hands-On Cybersecurity Training
            </h2>

            <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              Get ready for immersive cybersecurity labs designed to bridge the
              gap between theory and real-world application. Our upcoming lab
              environment will provide safe, controlled spaces to practice
              penetration testing, vulnerability assessment, and incident
              response techniques.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-medium text-white">
              What You'll Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Virtual Environments
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Realistic network topologies with vulnerable systems, web
                  applications, and enterprise infrastructure to practice
                  ethical hacking techniques safely.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Guided Scenarios
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Step-by-step walkthroughs and progressive challenges that
                  build from basic reconnaissance to advanced exploitation and
                  post-exploitation techniques.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Tool Mastery
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Hands-on experience with industry-standard tools like
                  Metasploit, Burp Suite, Nmap, Wireshark, and custom
                  exploitation frameworks.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Real-World Skills
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Practice report writing, risk assessment, remediation
                  planning, and communication skills essential for cybersecurity
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h1 className="text-4xl md:text-5xl font-semibold text-zinc-300">
            Coming Soon
          </h1>

          <div className="space-y-4">
            <div className="w-24 h-1 bg-zinc-700 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-zinc-300">
              Hands-On Cybersecurity Training
            </h2>

            <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              Get ready for immersive cybersecurity labs designed to bridge the
              gap between theory and real-world application. Our upcoming lab
              environment will provide safe, controlled spaces to practice
              penetration testing, vulnerability assessment, and incident
              response techniques.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-medium text-white">
              What You'll Experience
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Virtual Environments
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Realistic network topologies with vulnerable systems, web
                  applications, and enterprise infrastructure to practice
                  ethical hacking techniques safely.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Guided Scenarios
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Step-by-step walkthroughs and progressive challenges that
                  build from basic reconnaissance to advanced exploitation and
                  post-exploitation techniques.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Tool Mastery
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Hands-on experience with industry-standard tools like
                  Metasploit, Burp Suite, Nmap, Wireshark, and custom
                  exploitation frameworks.
                </p>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-6 text-left">
                <h4 className="text-lg font-medium text-white mb-3">
                  Real-World Skills
                </h4>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  Practice report writing, risk assessment, remediation
                  planning, and communication skills essential for cybersecurity
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
