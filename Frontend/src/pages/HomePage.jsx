import React from 'react';

const HomePage = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Ízek, amelyek <span className="text-primary-600">összehoznak</span>
        </h1>
        <p className="text-xl text-gray-600">
          Rendeld meg kedvenc ételeidet online, gyorsan és egyszerűen. Friss alapanyagok, szenvedélyes szakácsok, felejthetetlen ízélmény.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a
            href="/menu"
            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Étlap Megtekintése
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-white text-gray-900 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Csatlakozz Hozzánk
          </a>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon="🚀"
          title="Gyors Kiszállítás"
          description="Nem kell órákat várnod. Futáraink a lehető leggyorsabban juttatják el hozzád a rendelésed."
        />
        <FeatureCard
          icon="🥗"
          title="Friss Alapanyagok"
          description="Helyi termelőktől szerezzük be alapanyagainkat, hogy minden falat tökéletes legyen."
        />
        <FeatureCard
          icon="💳"
          title="Egyszerű Fizetés"
          description="Fizess kényelmesen online vagy készpénzzel a futárnál."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
