import Layout from "@/components/Layout";
import { registerFormUrl } from "@/data/siteData";

const Register = () => {
  return (
    <Layout>
      <section className="bg-primary py-16 sm:py-20">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl">Join Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
            Become a member of Progressive Abia Youths and be part of the movement driving change in Abia State.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border bg-card shadow-sm">
            <iframe
              src={registerFormUrl}
              title="Progressive Abia Youths Registration Form"
              className="h-[800px] w-full border-0"
              allowFullScreen
            >
              Loading…
            </iframe>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
