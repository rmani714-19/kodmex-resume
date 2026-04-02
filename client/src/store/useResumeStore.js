import { create } from "zustand";
import { createEmptyResumeData, getSampleResumeData } from "@shared/resumeEngine.js";

const initialResumeData = createEmptyResumeData();
const initialWizardAnswers = {
  experienceLevel: "",
  companyType: "",
  industries: [],
  buildMode: "",
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    pincode: "",
    linkedin: "",
    github: "",
    portfolio: ""
  }
};

export const useResumeStore = create((set) => ({
  currentStep: 1,
  wizardStep: 1,
  wizardAnswers: initialWizardAnswers,
  resumeData: initialResumeData,
  generatedResume: null,
  atsScore: null,
  loading: false,
  inputMode: "editor",
  selectedTemplate: "modern",
  setCurrentStep: (currentStep) => set({ currentStep }),
  setWizardStep: (wizardStep) => set({ wizardStep }),
  updateWizardAnswers: (updater) =>
    set((state) => ({
      wizardAnswers: typeof updater === "function" ? updater(state.wizardAnswers) : updater
    })),
  setInputMode: (inputMode) => set({ inputMode }),
  setResumeData: (resumeData) => set({ resumeData }),
  updateResumeData: (updater) =>
    set((state) => ({
      resumeData: typeof updater === "function" ? updater(state.resumeData) : updater
    })),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
  setGeneratedResume: (generatedResume) => set({ generatedResume }),
  setAtsScore: (atsScore) => set({ atsScore }),
  setLoading: (loading) => set({ loading }),
  loadSampleResume: () =>
    set({
      resumeData: getSampleResumeData()
    }),
  resetBuilder: () =>
    set({
      currentStep: 1,
      wizardStep: 1,
      wizardAnswers: initialWizardAnswers,
      resumeData: createEmptyResumeData(),
      generatedResume: null,
      atsScore: null,
      loading: false,
      selectedTemplate: "modern"
    })
}));
