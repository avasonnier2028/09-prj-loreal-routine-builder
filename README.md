# Project 9: L'Oréal Routine Builder
L’Oréal is expanding what’s possible with AI, and now your chatbot is getting smarter. This week, you’ll upgrade it into a product-aware routine builder. 

Users will be able to browse real L’Oréal brand products, select the ones they want, and generate a personalized routine using AI. They can also ask follow-up questions about their routine—just like chatting with a real advisor.

##

Building off from [08-prj-loreal-chatbot](https://github.com/avasonnier2028/08-prj-loreal-chatbot)

##

### Tasks

- Product Selection
  - [ ] Select & Unselect
  - [ ] Updates Visuals
  - [ ] Adds & Removes from list
- Routine Generator
  - [ ] Sends selected product data
  - [ ] Displays personalized routine
- [ ] Follow-Up Chat
- Save Selected Products
  - [ ] Selections persist on reload
  - [ ] Selections can be removed/cleared
- [ ] Reveal Product Description
- [ ] Cloudflare Worker Integration
- [ ] **(BONUS)** Web Search
- [ ] **(BONUS)** Product Search
- [ ] **(BONUS)** RTL Language Support

## 

### Rubric
|Criteria|Requirements|Pts|
| --- | --- | ---: |
| Product Selection | Clicking a product selects or unselects it, updates the visual state (e.g., border or highlight), and adds/removes the product from the selected list above the button | 10pts |
| Routine Generator | Clicking "Generate Routine" sends selected product data to the OpenAI API and displays a personalized routine in the chat | 10pts |
| Follow-Up Chat |Users can ask follow-up questions and get relevant responses that reflect prior conversation | 10pts |
| Save Selected Products | Selected products persist after a page reload and can be removed or cleared by the user | 10pts |
| Reveal Product Description | Each product's description is displayed clearly and accessibly (e.g., hover overlay, modal, toggle button, expanded card, etc.) | 5pts |
| Cloudflare Worker Integration | API requests are routed through a Cloudflare Worker and no key is exposed in the browser | 5pts |
| __(BONUS)__ Add Web Search | Chatbot responses include current, real-world information with visible links or citations | 10pts |
| __(BONUS)__ Add Product Search | Product search field filters products by name or keyword in real-time, displaying matching products seamlessly alongside category filters | 10pts |
| __(BONUS)__ RTL Language Support | Layout supports right-to-left (RTL) languages. The product grid, selected products section, and chat interface all adjust correctly when RTL is active | 5pts |



