function Autobind(target: any, methodName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    return {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        get() {
            return descriptor.value.bind(this);
        }
    }
}

interface Validatable {
    value: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validateInput(input: Validatable): boolean {
    let isValid = true;

    if (input.required) {
        isValid = isValid && !!input.value && input.value.trim().length !== 0;
    }

    if (input.minLength) {
        isValid = isValid && !!input.value && input.value.trim().length >= input.minLength;
    }

    if (input.maxLength) {
        isValid = isValid && !!input.value && input.value.trim().length <= input.maxLength;
    }

    if (input.min) {
        isValid = isValid && !!input.value && +input.value >= input.min;
    }

    if (input.max) {
        isValid = isValid && !!input.value && +input.value <= input.max;
    }

    return isValid;
}

function validateInputs(inputs: Array<Validatable>): boolean {
    let isValid = true;
    for (const input of inputs) {
        isValid = isValid && validateInput(input);
    }
    return isValid;
}

class ProjectInput {

    appElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleElement: HTMLInputElement;
    descriptionElement: HTMLTextAreaElement;
    peopleElement: HTMLInputElement;

    constructor() {
        this.appElement = document.getElementById('app')! as HTMLDivElement;
        const projectInputTemplateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        const node = document.importNode(projectInputTemplateElement.content, true);
        
        this.formElement = node.firstElementChild! as HTMLFormElement;

        this.titleElement = this.formElement.querySelector('#title')! as HTMLInputElement;
        this.descriptionElement = this.formElement.querySelector('#description')! as HTMLTextAreaElement;
        this.peopleElement = this.formElement.querySelector('#people')! as HTMLInputElement;

        this.attachEventListener();
    }

    attachProjectInput() {
        this.formElement.id = 'user-input';
        this.appElement.appendChild(this.formElement);
    }

    private attachEventListener() {
        this.formElement.addEventListener('submit', this.onFormSubmit);
    }

    @Autobind
    private onFormSubmit(event: Event) {
        event.preventDefault();
        this.gatherUserInput();
    }

    private gatherUserInput(): [string, string, number] | void {
        const inputs: Array<Validatable> = [
            {
                value: this.titleElement.value,
                required: true,
                minLength: 5,
            },
            {
                value: this.descriptionElement.value,
                required: true,
                minLength: 10
            },
            {
                value: this.peopleElement.value,
                required: true,
                min: +this.peopleElement.min,
                max: +this.peopleElement.max
            }
        ];

        if (validateInputs(inputs)) {
            return [this.titleElement.value, this.descriptionElement.value, +this.peopleElement.value]
        } else {
            alert('Invalid Input');
        }
    }
}

const projectInput = new ProjectInput();
projectInput.attachProjectInput();
